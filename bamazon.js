// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");  
var inquirer = require("inquirer");   

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,  
  user: "root",  
  password: "Jack1348",  
  database: "bamazon" 
});

connection.connect(function(err) {
		if (err) throw err;
);

// display products to the customer
var displayProducts = function(){
	var query = "Select * FROM products";
	connection.query(query, function(res, err){
		if(err) throw err;
		var displayTable = new Table ({
			head: ["Item_id", "product_name", "department_name", "price", "stock_quantity"],
			colWidths: [10,25,25,10,14]
		});
		for(var i = 0; i < res.length; i++){
			displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(displayTable.toString());
			purchasePrompt();
	});
};

//function to list and purhcase products 
function purchaseProduct() {
	inquirer
	  .prompt({
			
		name: "idAndBuy",
		message: "What product [ID] would you like to [BUY] at the store? Or do you wan to [E}XIT]",
		choices: ["ID", "BUY", "EXIT"]
	  })
	  .then(function(answer) {
		
		if (answer.idAndBuy === "ID") {
		  productID();
		},

		else if(answer.idAndBuy === "BUY") {
			purchaseProduct();
		},
		
		else if(answer.idAndBuy === "EXIT"){
			console.log('byeByeBye);
		},
		
		else{
		  connection.end();
		};
	  });
	}

	//function for actually purchasing products
  function purchaseProduct(){
	  inquirer
	  	.prompt({
				type: "input",
			  name: "ID",
			  type: "input",
			  message: "Enter the ID of the product you want to buy?",
			  filter: "number",
		  },
		  {
			  name: "Buy",
			  type: "input",
			  message: "How much product would you like to buy?",
			  filter: "number"
			};
		
		.then(function(answers){
		
		var quantityNeeded = answers.Quantity;
		
		var IDrequested = answers.ID;
		
		purchaseOrder(IDrequested, quantityNeeded);
	});
 
	function purchaseOrder(ID, amtNeeded){

	connection.query('Select * FROM products WHERE item_id = ' + ID, function(err,res){
		 
		if(err){console.log(err)};
		 
		if(amtNeeded <= res[0].stock_quantity){
			 
			var totalCost = res[0].price * amtNeeded;
			 
			console.log("Good news your order is in stock!");
			 console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!");
 
			 connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + "WHERE item_id = " + ID);
		 } else{
			 console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
		 };
		 displayProducts();
	 });
 };
 
