const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgpu');

context.configure({
    device: device, 
    format: 'rgba8unorm',
});

/*ne pozabi odpreti port v cmd v pythonu:: python -m http.server 3000*/ 
/*Rabimo narediti pipeline, format vhodnih podatkov, format izhodnih podatkov
VS IN FS (senčilnik oglišč in senčilnik fragmentov...slika na fonu*/

const code = await fetch('shader.wgsl').then(response => response.text());
const module = device.createShaderModule({code});
const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
        module: module,
    },
    fragment: {
        module: module,
        targets: [{format: 'rgba8unorm'}],
    },
});
const commandEncoder = device.createCommandEncoder();

const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [{
        view: context.getCurrentTexture(),
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: [1, 1, 0, 1]
    }],
});
renderPass.setPipeline(pipeline);
//renderPass.draw(3);// za trikotnik rabimo 3 oglišča, ker grafična ne zna risati nič drugega kot trikotnike za kvadart rabimo 6 oglišč
renderPass.draw(6); // za kvadrat rabimo 6 oglišč
renderPass.end();

device.queue.submit([commandEncoder.finish()]); 