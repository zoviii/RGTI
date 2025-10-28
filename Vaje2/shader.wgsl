//rabimo 2 funkciji: vs in fs
struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) color: vec4f,
    
}

@group(0)
@binding(0)
var<uniform> matrix: mat4x4f;

@vertex
//vrne ogljišča
fn vertex(@location(0) position: vec4f, @location(1) color: vec4f) -> VertexOutput {
    var output: VertexOutput;

    output.position = matrix * position;
    output.color = color;
    return output;
}
	
@fragment
//vrne barvo
fn fragment(@location(1) color: vec4f) -> @location(0) vec4f {
	return color;
}


