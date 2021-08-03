const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: orders });
  }

  function validDeliverTo(req, res, next){
    const bodyDeliverTo = req.body.data.deliverTo;
    if (!bodyDeliverTo || bodyDeliverTo==="") {
      return next({
        status: 400,
        message: "Order must include a deliverTo",
      });
    }
    res.locals.newDeliverTo = bodyDeliverTo;
    next();
  }

  function validMobile(req, res, next){
    const bodyMobile = req.body.data.mobileNumber;
    if (!bodyMobile || bodyMobile==="") {
      return next({
        status: 400,
        message: "Order must include a mobileNumber",
      });
    }
    res.locals.newMobile = bodyMobile;
    next();
  }



  function validDishes(req, res, next){
    const bodyDishes = req.body.data.dishes;
    if (!bodyDishes) {
      return next({
        status: 400,
        message: "Order must include a dish",
      });
    }
    if (!Array.isArray(bodyDishes) || bodyDishes.length<1){
        return next({
            status:400,
            message: "Order must include at least one dish"
        })
    }
    
   
    if (bodyDishes.find((item) => !item.quantity || item.quantity >2 || !Number.isInteger(item.quantity))){
        return next({
            status:400,
            message: `Dish must have a quantity that is an integer greater than 0, than 1, or 2`
        })
    }
    
    res.locals.newDishes = bodyDishes;
    next();
  }

  

function create(req, res) {

    const newDeliverTo = res.locals.newDeliverTo;
    const newMobile = res.locals.newMobile
    const newDishes = res.locals.newDishes
    const newId = nextId()
    const newEntry = { deliverTo: newDeliverTo, mobileNumber: newMobile, id:newId, dishes:newDishes };
  console.log(newEntry)
    orders.push(newEntry);
    res.status(201).json({ data: newEntry });
  }

function orderExists(request, response, next) {
    const { orderId } = request.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
      response.locals.order = foundOrder;
      return next()
    }
    next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    });
  }

  function read(req, res, next) {
    res.json({ data: res.locals.order });
  }

  function update(req, res,next) {
    if(req.body.data.id && req.body.data.id != req.params.orderId){
      return next({
        status:400,
        message:`id should match ${req.body.data.id}`
      })
    }
    let existingOrder = res.locals.order;
   const newDeliverTo = res.locals.newDeliverTo;
    const newMobile = res.locals.newMobile
    const newDishes = res.locals.newDishes
 
    const updatedEntry = {...existingOrder, deliverTo: newDeliverTo, mobileNumber: newMobile, dishes:newDishes };

      console.log(updatedEntry)

    res.json({ data: updatedEntry });
  }


  function validStatus(req, res, next){
    const bodyStatus = req.body.data.status;
    if (!bodyStatus || bodyStatus==="" || bodyStatus !=="pending") {
      return next({
        status: 400,
        message: "Incorrect status",
      });
    }
    res.locals.newStatus = bodyStatus;
    next();
  }

 

function destroy(request, response, next) {
  const { orderId } = request.params;
  const index = orders.findIndex((order) => order.id === orderId);
if (orders[index].status !== "pending") 
  return next({
 status: 400,
  message: "pending"
})
  
  const deletedOrder = orders.splice(index, 1);


  response.sendStatus(204);
}



  module.exports = {
    list,
    create: [validDeliverTo, validMobile, validDishes, create],
    read: [orderExists, read],
    update: [orderExists, validStatus, validDeliverTo, validMobile, validDishes, update],
    destroy: [orderExists, destroy]
}