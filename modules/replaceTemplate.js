module.exports = (temp, product) => {
  let output = temp.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%NAME%}/g, product.name);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%CATEGORY%}/g, product.category);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%SELLER%}/g, product.seller);
  return output;
};

