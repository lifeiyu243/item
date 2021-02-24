const path = require('path');
const jquery = require('jquery');
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/', 
	
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  
   chainWebpack: config => {
    	config.resolve.alias
            .set('@', path.resolve('examples')) 
            .set('~', path.resolve('packages'));
        config.module
            .rule('eslint')
            .exclude.add(path.resolve('lib'))
            .end()
            .exclude.add(path.resolve('examples/docs'))
            .end();
        config.module
            .rule('js')
            .include.add(/packages/)
            .end()
            .include.add(/examples/)
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options;
            });
        config.module
        	.rule('expose1')
        	.test(require.resolve('jquery'))
        	.use()
        	.loader('expose-loader')
        	.options('jQuery')
        	.end();
        config.module
        	.rule('expose2')
        	.test(require.resolve('jquery'))
        	.use()
        	.loader('expose-loader')
        	.options('$')
        	.end();
        
    }
}