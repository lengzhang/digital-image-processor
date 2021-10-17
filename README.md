# Digital Image Processor

This project is a course project to display a source image and process images.

- This project is built from [Create React App](https://github.com/facebook/create-react-app) and uses [Material-UI](https://v4.mui.com/) for UI.
- User is able to import an image as source image and process the source image with different algorithms.
- All image processing algorithms are run in [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).
- All images are display by [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Website

[Digital Image Processor by Leng Zhang](https://digital-image-processor.lengzhang.me/)

## Course Information

### Name

Digital Image Processing (2021 Fall CS 5550)

### Instructor

[Dr. Amar Raheja](https://www.cpp.edu/~raheja/)

### College

[Computer Science](https://www.cpp.edu/sci/computer-science/) - [Cal Poly Pomona](https://www.cpp.edu/index.shtml)

## Digital Image Processing Features

> All image processing algorithm are run in Web Worker, and worker files are at `/public/web-workers`

- Bit Planes Removing
- Gray Level Resolution (Gray Scale)
- Histogram Equalization
  - Global
  - Local
- Noise Distribution
  - Gaussian
- Operation
  - Addition
  - Subtraction
  - Scaling
- Spatial Resolution
  - Bilinear Interpolation
  - Linear Interpolation (X Coordinate)
  - Linear Interpolation (Y Coordinate)
  - Nearest Neighbor Interpolation
- Spatial Filter
  - Alpha-trimmed mean filter
  - Arithmetic mean filter
  - Contraharmonic mean filter
  - Geometric mean filter
  - Gaussian Smoothing filter
  - Harmonic mean filter
  - Max filter
  - Median filter
  - Midpoint filter
  - Min filter
  - Sharpening Laplacian filter

## How to start service at local environment?

1. `yarn install`
2. `yarn start`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Packages Used

- [Material-UI V4](https://v4.mui.com/) - UI components library
- [Jimp](https://github.com/oliver-moran/jimp) - Converring the source image into `ImageData`
- [Chart.js](https://github.com/chartjs/Chart.js) - Used to show histogram for each image

## Reference

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Material-UI V4](https://v4.mui.com/)
- [Jimp](https://github.com/oliver-moran/jimp)
- [Chart.js](https://github.com/chartjs/Chart.js)
- [java 实现双线性插值法与图像灰度值变换](https://www.cxyzjd.com/article/u012679980/49449647)
- [灰度值-百度百科](https://baike.baidu.com/item/%E7%81%B0%E5%BA%A6%E5%80%BC?fr=aladdin)
- [Handling Zeros In Geometric Mean Calculation](https://www.wwdmag.com/channel/casestudies/handling-zeros-geometric-mean-calculation)
