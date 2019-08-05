### WebGL光照阴影映射
阴影综合 (多物体高精度PCF)
- 帧缓冲
- 阴影映射(shadow mapping)
- 提高阴影精度
- 抗锯齿(PCF)

#### 默认情况下，WebGL 在颜色缓冲区绘图，使用隐藏面消除的话，还会用到深度缓冲区
- 颜色缓冲区
- 深度缓冲区

帧缓冲区对象 framebuffer object可以用来代替颜色缓冲区或深度缓冲区
绘制在帧缓冲区中的对象并不会直接显示canvas上，可以先对帧缓冲区中的内容进行一些处理再显示，或者直接用其中的内容作为纹理图像
在帧缓冲区中进行绘制的过程又称为离屏绘制 offscreen drawing

#### 帧缓冲区有 3 个关联对象：
- 颜色关联对象 color attachment，对应颜色缓冲区
- 深度关联对象 depth attachment，对应深度缓冲区
- 模板关联对象 stencil attachment，对应模板缓冲区

#### 看看帧缓冲区的创建和配置：
- 创建帧缓冲区对象 gl.createFramebffer()
- 创建文理对象并设置其尺寸和参数 gl.createTexture()、gl.bindTexture()、gl.texImage2D()、gl.Parameteri()
- 创建渲染缓冲区对象 gl.createRenderbuffer()
- 绑定渲染缓冲区对象并设置其尺寸 gl.bindRenderBuffer()、gl.renderbufferStorage()
- 将帧缓冲区的颜色关联对象指定为一个文理对象 gl.frambufferTexture2D()
- 将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象 gl.framebufferRenderbuffer()
- 检查帧缓冲区是否正确配置 gl.checkFramebufferStatus()
- 在帧缓冲区中进行绘制 gl.bindFramebuffer()

### 阴影映射
阴影映射的原理很简单，首先从光的角度渲染场景，从光的角度看到的所有东西都被点亮了，而看不见的部分一定是在阴影里

#### 阴影映射要渲染两遍：
- 从光源的角度渲染场景,同时把场景的深度值当成纹理渲染到帧缓冲区,也就是把它当作数据容器
- 从眼睛的角度渲染场景,把物体真正渲染到画布中,同时对比纹理的深度值,将阴影部分也渲染出来

### 提高精度
#### 阴影片段着色器
```
# ifdef GL_ES
precision mediump float; 
# endif
void main () {
    gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0); //将深度值z存放到第一个分量r中
}
```

```
precision mediump float;
uniform sampler2D u_ShadowMap;
varying vec4 v_PositionFromLight;
varying vec4 v_color;

void main () {
    // 获取纹理的坐标
    vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
    
    // 根据阴影xy坐标,获取纹理中对应的点,z值已经被之前的阴影着色器存放在该点的r分量中了,直接使用即可
    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
    
    // 获取指定纹理坐标处的像素颜色rgba
    float visibility = (shadowCoord.z > rgbaDepth.r + 0.005) ? 0.6 : 1.0;
    
    // 大于阴影的z轴,说明在阴影中并显示为阴影*0.6,否则为正常颜色*1.0
    gl_FragColor = vec4(v_color.rgb * visibility, v_color.a);
}
```

### 抗锯齿(PCF)
解决了精度的问题,接着继续优化

```
vec3 shadowCoord = (v_positionFromLight.xyz/v_positionFromLight.w)/2.0 + 0.5;
float shadows =0.0;
float opacity=0.6;// 阴影alpha值, 值越小暗度越深
float texelSize=1.0/1024.0;// 阴影像素尺寸,值越小阴影越逼真
vec4 rgbaDepth;

// 消除阴影边缘的锯齿
for(float y=-1.5; y <= 1.5; y += 1.0){
    for(float x=-1.5; x <=1.5; x += 1.0){
        rgbaDepth = texture2D(u_shadowMap, shadowCoord.xy+vec2(x,y)*texelSize);
        shadows += shadowCoord.z-bias > unpack(rgbaDepth) ? 1.0 : 0.0;
    }
}

// 4*4的样本
shadows /= 16.0;
float visibility = min(opacity + (1.0 - shadows), 1.0);

// 阴影处没有高光
specular = visibility < 1.0 ? vec3(0.0, 0.0, 0.0) : specular;
gl_FragColor = vec4((diffuse + ambient + specular) * visibility, v_color.a);
```
