// zagon svojega serverja: python3 -m http.server 3000
// 3000 je številka porta, lahko daš poljubno (privzeta: 8000)

const adapter = await navigator.gpu.requestAdapter(); // izberemo s katero grafično bomo delali
const device = await adapter.requestDevice(); //dejanska incializacija


const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgpu');
context.configure({
    device: device,
    format: 'rgba8unorm',
});

// pipeline: format vhodnih podatkov
//     format izhodnih podatkov
//     znotraj pipeline-a imamo pa ta 2 naša programčka - shaderja/senčilnika

const code = await fetch('shader.wgsl').then(response => response.text());
const module = device.createShaderModule({ code });

const vertexBufferLayout = {
    arrayStride: 16,
    attributes: [{
        format: 'float32x4',
        offset: 0,
        shaderLocation: 0,
    }]
    

};

const colorBufferLayout = {
    arrayStride: 16,
    attributes: [{
        format: 'float32x4',
        offset: 0,
        shaderLocation: 1,
    }]
    

};

const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: module,
        buffers: [vertexBufferLayout, colorBufferLayout],
    },
    fragment: {
        module: module,
        targets: [{
            format: 'rgba8unorm'
        }]
    },

});

// postions
const vertices = new Float32Array ([ // podatki v glavnem pomnilniku
    -0.5, -0.5, 0, 1,
    0.5, -0.5, 0, 1,
    -0.5, 0.5, 0, 1,
    
    0.5, -0.5, 0, 1,
    -0.5, 0.5, 0, 1,
    0.5, 0.5, 0, 1,

]);

// imamo alokacijo pomnilnika v grafični kartici
const vertexBuffer = device.createBuffer({
   size: 96,
   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

});
    

// podatke moramo zdaj prenesti it gl. pom. v pomn. v graf. kartici
device.queue.writeBuffer(vertexBuffer, 0, vertices);

//colors
const colors = new Float32Array ([ // podatki v glavnem pomnilniku
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 1, 0, 1,

]);

// imamo alokacijo pomnilnika v grafični kartici
const colorBuffer = device.createBuffer({
   size: 96,
   usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,

});
    
// podatke moramo zdaj prenesti it gl. pom. v pomn. v graf. kartici
device.queue.writeBuffer(colorBuffer, 0, colors);

//matrix

const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    
});

const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{
        binding: 0,
        resource: uniformBuffer,
    }]
    
});

let x = -1;
let y = -1;

function frame() {

    x += 0.01;
    y += 0.01;
    
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, 0, 1,
        
    ]));
    
    const commandEncoder = device.createCommandEncoder();

    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: [1, 0, 1, 1]
        }]
    });

    renderPass.setPipeline(pipeline); //ne dela, ker imamo prazen pipeline
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setVertexBuffer(1, colorBuffer);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(6);
    renderPass.end();
    requestAnimationFrame(frame);
    device.queue.submit([commandEncoder.finish()]);
    
}
requestAnimationFrame(frame);






