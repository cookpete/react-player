var context = require.context('./karma', true, /\.js$/)
context.keys().forEach(context)
