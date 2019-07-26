#### 变量限定符
- none	(默认的可省略)本地变量,可读可写,函数的输入参数既是这种类型
- const	声明变量或函数的参数为只读类型
- attribute	只能存在于vertex shader中,一般用于保存顶点或法线数据,它可以在数据缓冲区中读取数据
- uniform	在运行时shader无法改变uniform变量, 一般用来放置程序传递给shader的变换矩阵，材质，光照参数等等.
- varying	主要负责在vertex 和 fragment 之间传递变量

#### 基本类型	
- void 空类型,即不返回任何值
- bool 布尔类型 true,false
- int	带符号的整数 signed integer
- float	带符号的浮点数 floating scalar
- vec2, vec3, vec4	n维浮点数向量 n-component floating point vector
- bvec2, bvec3, bvec4	n维布尔向量 Boolean vector
- ivec2, ivec3, ivec4	n维整数向量 signed integer vector
- mat2, mat3, mat4	2x2, 3x3, 4x4 浮点数矩阵 float matrix
- sampler2D	2D纹理 a 2D texture
- samplerCube	盒纹理 cube mapped texture

#### 函数参数限定符
- < none: default >	默认使用 in 限定符
- in	复制到函数中在函数中可读写
- out	返回时从函数中复制出来
- inout	复制到函数中并在返回时复制出来

#### 内置的特殊变量
- vertex Shader
  - output 类型
    - highp vec4 gl_Position;	gl_Position 放置顶点坐标信息	vec4
    - mediump float gl_PointSize;	gl_PointSize 需要绘制点的大小,(只在gl.POINTS模式下有效)	float
    
- fragment Shader
  - input 类型的内置变量
    - mediump vec4 gl_FragCoord;	片元在framebuffer画面的相对位置	vec4
    - bool gl_FrontFacing;	标志当前图元是不是正面图元的一部分	bool
    - mediump vec2 gl_PointCoord;	经过插值计算后的纹理坐标,点的范围是0.0到1.0	vec2
  
  - output 类型的内置变量
    - mediump vec4 gl_FragColor;	设置当前片点的颜色	vec4 RGBA color
    - mediump vec4 gl_FragData[n]	设置当前片点的颜色,使用glDrawBuffers数据数组	vec4 RGBA color
    
#### 内置的常量
glsl提供了一些内置的常量,用来说明当前系统的一些特性. 有时我们需要针对这些特性,对shader程序进行优化,让程序兼容度更好.

##### 在 vertex Shader 中
- const mediump int gl_MaxVertexAttribs>=8
- gl_MaxVertexAttribs 表示在vertex shader(顶点着色器)中可用的最大attributes数.这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 8 个.
- const mediump int gl_MaxVertexUniformVectors >= 128
- gl_MaxVertexUniformVectors 表示在vertex shader(顶点着色器)中可用的最大uniform vectors数. 这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 128 个.
- const mediump int gl_MaxVaryingVectors >= 8
- gl_MaxVaryingVectors 表示在vertex shader(顶点着色器)中可用的最大varying vectors数. 这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 8 个.
- const mediump int gl_MaxVertexTextureImageUnits >= 0
- gl_MaxVaryingVectors 表示在vertex shader(顶点着色器)中可用的最大纹理单元数(贴图). 这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 甚至可以一个都没有(无法获取顶点纹理)
- const mediump int gl_MaxCombinedTextureImageUnits >= 8
- gl_MaxVaryingVectors 表示在 vertex Shader和fragment Shader总共最多支持多少个纹理单元. 这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 8 个.

##### 在 fragment Shader 中
- const mediump int gl_MaxTextureImageUnits >= 8
- gl_MaxVaryingVectors 表示在 fragment Shader(片元着色器)中能访问的最大纹理单元数,这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 8 个
- const mediump int gl_MaxFragmentUniformVectors >= 16
- gl_MaxFragmentUniformVectors 表示在 fragment Shader(片元着色器)中可用的最大uniform vectors数, 这个值的大小取决于 OpenGL ES 在某设备上的具体实现, 不过最低不能小于 16 个
- const mediump int gl_MaxDrawBuffers = 1
- gl_MaxDrawBuffers 表示可用的drawBuffers数, 在OpenGL ES 2.0中这个值为1, 在将来的版本可能会有所变化
- glsl中还有一种内置的uniform状态变量, gl_DepthRange 它用来表明全局深度范围


