const _ = require('lodash');
const Op = require('sequelize');

function toCamel(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

module.exports = (body, keys, assign) => {
  const attributes = {};

  keys.forEach((key) => {
    const val = body[toCamel(key)];
    if (!_.isUndefined(val) && !_.isNaN(val)) { attributes[key] = val; }
  });

  if (assign) {
    return _.assign(attributes, assign);
  }

  return attributes;
};

module.exports.relation = async (id, model, ctx) => {
  const inst = await model.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
  });
  if (!inst) { ctx.throw(400, 'MODEL_NOT_FOUND'); }
  return inst;
};

module.exports.ids = async (ids, model, ctx) => ids.map(async (id) => {
  const inst = await model.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
  });
  if (!inst) { ctx.throw(400, 'MODEL_NOT_FOUND'); }
  return inst;
});
