attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;

varying highp vec3 vLighting;
varying lowp vec4 vColor;

highp mat4 transpose(in highp mat4 inMatrix) {
    highp vec4 i0 = inMatrix[0];
    highp vec4 i1 = inMatrix[1];
    highp vec4 i2 = inMatrix[2];
    highp vec4 i3 = inMatrix[3];

    highp mat4 outMatrix = mat4(
                 vec4(i0.x, i1.x, i2.x, i3.x),
                 vec4(i0.y, i1.y, i2.y, i3.y),
                 vec4(i0.z, i1.z, i2.z, i3.z),
                 vec4(i0.w, i1.w, i2.w, i3.w)
                 );

    return outMatrix;
}

void main(void) {
    gl_Position = uProjectionMatrix * aVertexPosition;
    vColor = aVertexColor;

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0, 0, 1));
    
    highp float directional = max(dot(aVertexNormal, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    //vLighting = vec3(0.5, 0.5, 0.5);
}