module.exports = {
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // config.output.publicPath = `${process.cwd()}/dist/`;
  //     config.baseUrl = `${process.cwd()}/dist/`;
  //   }
  // }
  baseUrl: process.env.NODE_ENV === 'production' ? `${process.cwd()}/dist/` : '/'
};
