---
  sidebarDepth: 2
  pageClass: custom-page-class
---

## 图片旋转

#### 前置知识 EXIF 

>EXIF，全称 Exchangeable image file format，是专门为数码相机的照片设定的，可以记录数码照片的属性信息和拍摄数据。<br>
>简单地说，EXIF 信息是由数码相机在拍摄过程中采集的一系列信息，然后把信息放置在我们熟知的 JPEG 文件的头部，即 EXIF 信息是镶嵌在 JPEG 图像文件格式内的一组拍摄参数，主要包括摄影时的光圈、快门、ISO、时间等各种与摄影条件相关的讯息，相机品牌型号，色彩编码，拍摄时录制的声音以及全球定位系统（GPS）等信息。

#### 前置知识 image-oritentaion

> CSS 属性 image-orientation 用来修正某些图片的预设方向.该属性使用存储在JPEG图像中的Exif数据进行旋转。<br>
> 该属性不是用来对图片进行任意角度旋转的, 它是用来修正那些带有不正确的预设方向的图片的. 因此该属性值会被四舍五入到 90 度的整数倍。<br>
> Tips: Firefox 75、 chrome 81 已将image-orientationCSS属性的初始值从none更改为from-image，safari也会在不久后跟进。<br>

### 图片旋转的场景及原因

一般场景：

一张拍摄的照片，在电脑/手机上看起来正向，上传到服务器后，方向偏转了。这里要分成两部分来看，为什么图片会出现前后不一致的情况。<br>
首先，我们在电脑/手机上看某张拍摄的照片，明明是带着方向的(比如横着拍摄),却是正向的？ 因为电脑/手机的读图软件在检查到照片的EXIF信息里的Oritentation时,得到图片拍摄相机的旋转信息。有此方位标志值，读图软件就知道该如何旋转图片保持正向。<br>
为什么我上传到云端的图片却歪了？因为缺少了读图软件的修正，而浏览器不主动扶正的情况下，照片展示了原本的方向。。。<br>
但是chrome,safari,firefox增加了image-oritentaion，来根据存储在照片里的exif来修正预设方向。<br>

这么说，有些图我们本地看是正的，上传后浏览器看还是正的，但这个图片其实是歪的。（没想到你这个浓眉大眼的居然...）但本地的看图软件和浏览器帮我们做了扶正。<br>

### 图片旋转的处理
既然是EXIF的问题，那么首先要获取到照片的EXIF信息，可以使用[exif-js](https://github.com/exif-js/exif-js) 这个工具来拿到图片信息。<br>

然后，根据EXIF里的方向信息对应旋转即可。对应关系为：<br>

![oritentation](https://pic.yupoo.com/leisurenana/1c3cd6b8/4c6b660f.jpg)<br>
![oritentation-form](https://pic.yupoo.com/leisurenana/2bf7758b/8ca4cdbe.jpg)<br>

代码直接贴了，我这里是已经得知了图片该左旋还是右转之后的部分，看下大概意思即可：

```js
/**
* 旋转图片，顺带会清楚掉图片exif信息
* @params file 需要旋转的file对象
* @params direction 选装方向。
* @returns 旋转后的file对象
*/
export const rotateImg = async (file, direction) => {
  // // 同一方向旋转4次回到原来方向
  const min_step = 0;
  const max_step = 3;
  if (!file) return;
  try {
    const img = new Image;
    img.src = await getDataURL(file);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    let step = 2;
    if (!step) {
      step = min_step;
    }
    if (direction === 'no') {
      step = 0;
    } else if (direction === 'left') {
      step++;
    // 超过最大值，则旋转到原位
      step > max_step && (step = min_step);
    } else if (direction === 'right') {
      step++;
      step < min_step && (step = max_step);
    } else {
    // 旋转180度
    }
    const ctx = tempCanvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    let degree = step * 90 * Math.PI / 180;
    switch (step) {
      case 0:
        tempCanvas.width = width;
        tempCanvas.height = height;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        break;
      case 1:
        tempCanvas.width = height;
        tempCanvas.height = width;
        ctx.fillStyle = '#fff';
        ctx.rotate(degree);
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, -height, width, height);
        break;
      case 2:
        tempCanvas.width = width;
        tempCanvas.height = height;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        ctx.rotate(degree);
        ctx.drawImage(img, -width, -height, width, height);
        break;
      case 3:
        tempCanvas.width = height;
        tempCanvas.height = width;
      // 铺底色
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, height, width);
        ctx.rotate(degree);
        ctx.drawImage(img, -width, 0, width, height);
        break;
      default:
        break;
    }
    return new Promise(resolve => tempCanvas.toBlob(blob => {
      resolve(new File([blob], file.name, {
        type: blob.type
      }));
    }, file.type));
  } catch (err) {
    throw new Error('rotateImg error');
    // return file;
  }
};

```

值得注意的是: 
- 在经过canvas.drawImage 后，照片的exif已经不存在了。这样处理后，无论是看图软件还是浏览器，就不会再去自动扶正了。你旋转的方向即是最终的方向。<br>
- canvas的旋转，是坐标轴的旋转，而不是元素的旋转。所以在旋转时要注意绘制原点的位置。可以参考这里[rotate](https://www.canvasapi.cn/CanvasRenderingContext2D/rotate)

### 其他方案？

如果只是想存储照片，而不是开发的业务需求，一些云服务商提供了更方便的解决方案。比如又拍云，七牛等。<br>
以又拍云为例，图片上传后，，可以通过云处理，快速的对图片进行自动扶正处理。即通过 URL 作图的方式，在图片地址后使用间隔标识符接上相应的作图参数，就可以实现对图片的快速处理。<br>
例如原图url为 https://p.upyun.com/docs/cloud/demo.jpg, 通过url参数增加!/rotate/auto 即https://p.upyun.com/docs/cloud/demo.jpg!/rotate/auto自动扶正， 增加/strip/true 参数来给图片去除掉 EXIF 信息<br>
可以查看这里文档[旋转](http://docs.upyun.com/cloud/image/#_15) [去EXIF等元信息](http://docs.upyun.com/cloud/image/#_20)
