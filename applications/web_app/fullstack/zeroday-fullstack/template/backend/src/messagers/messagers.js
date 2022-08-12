module.exports.hello = async (ctx) => {
  ctx.body = { message: 'hello' };
  ctx.status = 200;
};
