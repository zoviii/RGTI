@vertex
fn vertex(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
    //ZA TRIKOTNIK
    if(index == 0) {
        return vec4f(-0.5, -0.5, 0, 1);//x koordinata je prva, y koordinata je druga st
    } else if(index == 1) {
        return vec4f(0.5, -0.5, 0, 1);
    } else {
        return vec4f(0, 0.5, 0, 1);
    }
    
}
/*//ZA KVADRAT    
    /*if(index == 0) {
        return vec4f(-0.5, -0.5, 0.0, 1.0);
    } else if(index == 1) {
        return vec4f(0.5, -0.5, 0.0, 1.0);
    } else if(index == 2) {
        return vec4f(-0.5, 0.5, 0.0, 1.0);
    }else if(index == 3) {
        return vec4f(0.5, -0.5, 0.0, 1.0);
    } else if(index == 4) {
        return vec4f(-0.5, 0.5, 0.0, 1.0);
    } else {
        return vec4f(0.5, 0.5, 0.0, 1.0);
    }*/*/

@fragment
fn fragment() -> @location(0) vec4f {
    return vec4f(1, 0, 0, 1);
}