#### 内建函数基本上可以分为一下三类：
- 它们使用一些简便的方式提供必要的硬件功能，如材质贴图。这些函数单独通过着色器是无法模拟出来的
- 它们展示了一些可以常简单的写入的繁琐操作（clamp， mix等），但是这些操作非常普遍，并且提供直接对硬件的支持；对于编译器来说，将表达式映射到复杂的装配线指令上是非常困难的
- 它们提供了对图形硬件的操作，并且在适当时候进行加速

#### 角度和三角函数
- radian函数是将角度转换为弧度，degrees函数是将弧度转换为角度
- sin, cos, tan都是标准的三角函数
- asin, acos, atan是反三角函数
- genType有点像面向对象中泛型，即如果genType是float型的

#### 指数函数
- genType pow (genType x, genType y) x的y次方。如果x小于0，结果是未定义的。同样，如果x=0并且y<=0,结果也是未定义的。使用时应特别注意
- genType exp (genType x) e的x次方
- genType log (genType x) 计算满足x等于e的y次方的y的值。如果x的值小于0，结果是未定义的
- genType exp2 (genType x) 计算2的x次方
- genType log2 (genType x) 计算满足x等于2的y次方的y的值。如果x的值小于0，结果是未定义的。
- genType sqrt (genType x) 计算x的开方。如果x小于0，结果是未定义的。
- genType inversesqrt (genType x) 计算x的开方之一的值，如果x小于等于0，结果是未定义的。

#### 常用函数
- genType abs (genType x)
- genType sign (genType x)
- genType floor (genType x)
- genType ceil (genType x)
- genType fract (genType x)
- genType mod (genType x, float y)、genType mod (genType x, genType y)
- genType min (genType x, genType y)，genType min (genType x, float y)
- genType max (genType x, genType y)，genType max (genType x, float y)
- genType clamp (genType x, genType minVal, genType maxVal)、genType clamp (genType x, float minVal, float maxVal)
- genType mix (genType x, genType y, genType a)、genType mix (genType x, genType y, float a)
- genType step (genType edge, genType x)，genType step (float edge, genType x)
- genType smoothstep (genType edge0,genType edge1,genType x)，genType smoothstep (float edge0,float edge1,genType x)

#### 几何函数
- float length (genType x) 返回向量x的长度
- float distance (genType p0, genType p1) 计算向量p0，p1之间的距离
- float dot (genType x, genType y) 向量x，y之间的点积
- vec3 cross (vec3 x, vec3 y) 向量x，y之间的叉积
- genType normalize (genType x) 标准化向量，返回一个方向和x相同但长度为1的向量
- genType faceforward(genType N, genType I, genType Nref) 如果Nref和I的点积小于0，返回N；否则，返回-N；
- genType reflect (genType I, genType N) 返回反射向量
- genType refract(genType I, genType N,float eta) 返回折射向量


#### 矩阵函数
- mat matrixCompMult (mat x, mat y)
矩阵x乘以y，result[i][j]是 x[i][j] 和 y[i][j] 的标量积。注意，要获取线性代数矩阵的乘法，使用乘法操作符*

#### 向量相关函数
相关或相等的操作符(<, <=, >, >=, ==, !=)被定义（或保留），返回一个标量布尔值
- lessThan 比较x < y.
- lessThanEqual 比较x<=y
- greaterThan 比较x>y
- greaterThanEqual 比较x>=y
- equal 比较x==y
- notEqual 比较x!=y
- bool any(bvec x) 如果向量x的任何组件为true，则结果返回true。
- bool all(bvec x) 如果向量x的所有组件均为true，则结果返回true。
- bvec not(bvec x) 返回向量x的互补矩阵

#### 材质查找函数
纹理（材质）查找函数对于定点着色器和片元着色器都适用

#### 片元处理函数
片元处理函数只有在片元语言中才有，但在GLSL ES中没有片元处理函数
