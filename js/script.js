//Criar constantes para selecionar elementos
const clone = (el) => document.querySelector(el);
const cloneAll = (el) => document.querySelectorAll(el);
let modalQt = 1;
let modalKey = 0;
let cart = [];

//Mapear a lista de pizzas e adiciona-las a tela
pizzaJson.map((item, index) => {
  let pizzaItem = clone(".models .pizza-item").cloneNode(true);

  //Alterar um atributo e armazena-lo no "data-key" de acordo com a posição da lista
  pizzaItem.setAttribute("data-key", index);

  //Selecionar as respectivas áreas (classes) e alterar os valores substituindo pelos da lista
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  //Impedir a atualização da tela ao clicar num item
  pizzaItem.querySelector("a").addEventListener("click", (event) => {
    event.preventDefault();

    //A cahve é o click no próprio elemento, mas buscando a classe mais próxima ".pizza-item"
    let key = event.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;

    clone(".pizzaBig img").src = pizzaJson[key].img;
    clone(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    clone(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    clone(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    clone(".pizzaInfo--size.selected").classList.remove("selected");

    cloneAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    clone(".pizzaInfo--qt").innerHTML = modalQt;

    //Alterar a transição da opacidade e o display que está configurado como "none" no CSS
    clone(".pizzaWindowArea").style.opacity = 0;
    clone(".pizzaWindowArea").style.display = "flex";

    setTimeout(() => {
      clone(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  //Utilizar append() para inserir o conteúdo que já existe + o novo
  clone(".pizza-area").append(pizzaItem);
});

//Criar os eventos do modal
function closeModal() {
  clone(".pizzaWindowArea").style.opacity = 0;

  setTimeout(() => {
    clone(".pizzaWindowArea").style.display = "none";
  }, 500);
}

cloneAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

//Validação para que o contador não contabilize 0 ou números negativos
clone(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    clone(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

clone(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  clone(".pizzaInfo--qt").innerHTML = modalQt;
});

//Remover a classe que seleciona um botão e depois aplicar no botão que foi clicado
cloneAll(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", () => {
    clone(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

clone(".pizzaInfo--addButton").addEventListener("click", () => {
  //Qual a pizza ? Qual o tamanho ? Quantas pizzas
  let size = parseInt(
    clone(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identifier = pizzaJson[modalKey].id + "--" + size;
  let key = cart.findIndex((item) => item.identifier == identifier);

  //Depois de criar um identificador, validamos o item que já existe e a adição de um novo
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }

  updateCart();
  closeModal();
});

//Configurar a apresentação do carrinho
clone(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    clone("aside").style.left = "0";
  }
});

clone(".menu-closer").addEventListener("click", () => {
  clone("aside").style.left = "100vw";
});

//Criar função para atualizar as informações do carrinho
function updateCart() {
  //Configurar o mobile para apresentar a quantidade de itens no carrinho
  clone(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    clone("aside").classList.add("show");
    clone(".cart").innerHTML = "";

    let subtotal = 0;
    let total = 0;
    let discount = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = clone(".models .cart--item").cloneNode(true);
      let pizzaSizeName;

      //Referenciar os tamanhos das pizzas para serem apresentadas no carrinho
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }

          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      clone(".cart").append(cartItem);
    }

    discount = subtotal * 0.05;
    total = subtotal - discount;

    clone(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    clone(".desconto span:last-child").innerHTML = `R$ ${discount.toFixed(2)}`;
    clone(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

    clone(".cart--finalizar").addEventListener("click", () => {
      clone(".subtotal span:last-child").innerHTML = "R$ 0.00";
      clone(".desconto span:last-child").innerHTML = "R$ 0.00";
      clone(".total span:last-child").innerHTML = "R$ 0.00";

      clone(".cart").innerHTML = "";

      clone(".cart--modal").style.opacity = 0;
      clone(".cart--modal").style.display = "flex";

      setTimeout(() => {
        clone(".cart--modal").style.opacity = 1;
      }, 400);

      setTimeout(() => {
        clone("aside").classList.remove("show");
      }, 1000);
    });

    clone(".cart--modal").style.display = "none";
    
  } else {
    clone("aside").classList.remove("show");
    clone("aside").style.left = "100vw";
  }
}
