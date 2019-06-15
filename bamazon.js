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

  // Your password
  password: "Jack1348",  
  database: "bamazon" 
});


connection.connect(function(err) {
  if (err) throw err;
  
  start();
});
////function to display products to the customer
var displayProducts = function(){
	var query = "Select * FROM products";
	connection.query(query, function(err, res){
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
		purchaseßPrompt();
	});
}