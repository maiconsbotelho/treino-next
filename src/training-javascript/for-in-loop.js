const myCar = {
  make: "Toyota",
  model: "Camry",
  year: 202,
};

const fruntas = ["maçã", "uva", "laranja"];

// USO DE FOR IN
for (let i in myCar) console.log(i, myCar[i]);

// USO DE FOR OF
for (let i of fruntas) console.log(i);
