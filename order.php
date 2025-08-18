
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $quantity = $_POST["quantity"];
    $address = $_POST["address"];
    $file = fopen("orders.txt", "a");
    fwrite($file, "$name | $quantity KG | $address\n");
    fclose($file);
    echo "Order placed successfully!";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Chicken - Haj Poultry</title>
</head>
<body>
    <h2>Place Your Chicken Order</h2>
    <form method="post">
        Name: <input type="text" name="name" required><br><br>
        Quantity (KG): <input type="number" name="quantity" required><br><br>
        Address: <input type="text" name="address" required><br><br>
        <button type="submit">Order Now</button>
    </form>
</body>
</html>
