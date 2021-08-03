const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function validName(req, res, next){
    const bodyName = req.body.data.name;
    if (!bodyName || bodyName==="") {
      return next({
        status: 400,
        message: "Dish must include a name",
      });
    }
    res.locals.newName = bodyName;
    next();
  }

  function validDescription(req, res, next){
    const bodyDescription = req.body.data.description;
    if (!bodyDescription || bodyDescription==="") {
      return next({
        status: 400,
        message: "Dish must include a description",
      });
    }
    res.locals.newDescription = bodyDescription;
    next();
  }


  function validPrice(req, res, next){
    const bodyPrice = req.body.data.price;
    if (!bodyPrice){
        return next({
            status: 400,
            message: "Dish must include a price",
          })
    }
    if (bodyPrice <= 0 || !Number.isInteger(bodyPrice)) {
      return next({
        status: 400,
        message: "Dish must have a price that is an integer greater than 0",
      });
    }
    res.locals.newPrice = bodyPrice;
    next();
  }

  function validImage(req, res, next){
    const bodyImage = req.body.data.image_url;
    if (!bodyImage || bodyImage==="") {
      return next({
        status: 400,
        message: "Dish must include a image_url",
      });
    }
    res.locals.newImage = bodyImage;
    next();
  }

  

function create(req, res) {

    const newName = res.locals.newName;
    const newDescription = res.locals.newDescription
    const newPrice = res.locals.newPrice
    const newImage = res.locals.newImage
    const newId = nextId()
    const newEntry = { name: newName, description: newDescription, price:newPrice, image:newImage, id:newId };
  
    dishes.push(newEntry);
    res.status(201).json({ data: newEntry });
  }

function dishExists(request, response, next) {
    const { dishId } = request.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
      response.locals.dish = foundDish;
      return next()
    }
    next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    });
  }
  
  function read(req, res, next) {
    res.json({ data: res.locals.dish });
  }



  function update(req, res, next) {
    
    
 if(req.body.data.id && req.params.dishId != req.body.data.id){
   return next({
     status: 400,
     message: `Dish id does not match route id. Dish: ${req.body.data.id}, Route: ${req.params.dishId}`
   })
 }
    let existingDish = res.locals.dish;
 
    const newName = res.locals.newName;
    const newDescription = res.locals.newDescription
    const newPrice = res.locals.newPrice
    const newImage = res.locals.newImage
    const updatedEntry = { id: req.params.dishId, name: newName, description: newDescription, price:newPrice, image_url:newImage };
   
  
    existingDish = updatedEntry;
    res.json({ data: updatedEntry });
  }

function list(req, res) {
    res.json({ data: dishes });
  }

module.exports = {
    list,
    create: [validName, validDescription, validPrice, validImage, create],
    read: [dishExists, read],
    update: [dishExists, validName, validDescription, validPrice, validImage, update],
}
