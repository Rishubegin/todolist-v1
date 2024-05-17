const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://hrishabho40:oLjlaJYkYG90TxC3@cluster0.gxbsf2f.mongodb.net/todolistDB"
  )
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log(err));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({ name: "Welcome to your to do list" });
const item2 = new Item({ name: "Hit this to delete an Item" });
const item3 = new Item({ name: "Hit this to delete an item." });
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
function getday() {
  var today = new Date();
  var currenDay = today.getDay();
  var day = "";

  switch (currenDay) {
    case 0:
      day = "Sunday";
      break;

    case 1:
      day = "Monday";
      break;

    case 2:
      day = "Tuesday";
      break;

    case 3:
      day = "Wednesday";
      break;

    case 4:
      day = "Thursday";
      break;

    case 5:
      day = "Friday";
      break;

    case 6:
      day = "Saturday";
      break;

    default:
      console.log("Error");
  }
  return day;
}
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  var today = new Date();
  var currenDay = today.getDay();
  var day = "";

  switch (currenDay) {
    case 0:
      day = "Sunday";
      break;

    case 1:
      day = "Monday";
      break;

    case 2:
      day = "Tuesday";
      break;

    case 3:
      day = "Wednesday";
      break;

    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;

    case 6:
      day = "Saturday";
      break;

    default:
      console.log("Error");
  }
  Item.find().then(function (foundItem) {
    if (foundItem == 0) {
      Item.insertMany(defaultItems)
        .then(function () {
          console.log("Successfully updated the Items");
        })
        .catch(function (err) {
          console.log(err);
        });
      res.redirect("/");
    } else {
      res.render("list", { kindOfDay: getday(), newListItems: foundItem });
    }
    // mongoose.connection.close(); ye mat lagana ye connection close kr deta hai jab jarurat nhi hoti
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem; // newItem is the name of input tag
  const listName = req.body.list;
  console.log(listName);
  console.log(itemName);
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then(function (foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
});
app.post("/delete", function (req, res) {
  const checkboxid = req.body.checkbox;
  const listName = req.body.list;
  if (listName == undefined) {
    console.log(listName);
  } else if (listName == "Today") {
    Item.deleteOne({ _id: checkboxid })
      .then(function () {
        console.log(listName);
        console.log("Successfully deleted the items.");
      })
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/");
  } else {
    console.log(listName);
    // List.findOne({name: listName}).then(
    //   function(foundList) {
    //     result = foundList.items.filter(item => !item._id.equals(checkboxid));
    //   }
    // );
    List.updateOne(
      { name: listName },
      { $pull: { items: { _id: checkboxid } } }
    )
      .then(function () {
        console.log(checkboxid);
        console.log("Successfully deleted the items.");
      })
      .catch(function (err) {
        console.log(err);
        res.redirect("/" + listName);
      });
    res.redirect("/" + listName);
  }
});
app.get("/:listName", function (req, res) {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName })
    .then(function (foundList) {
      if (foundList) {
        // console.log("exists");
        res.render("listname", { kindOfDay: getday(), list: foundList });
      } else {
        // console.log("doesn't exist");
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        list.save();
        res.render("listname", { kindOfDay: getday(), list: list });
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .catch(function (err) {
      console.log(err);
    });
});

// app.post("/addCustomListItem", function (req, res) {
//   var newListItem = req.body.newCustomListItem;
//   const newCustomListItem = new Item({
//     name: newListItem,
//   });
//   List.findOne(name: listName)
//   list.items.insertOne(newCustomListItem);
//   res.render("listname", { kindOfDay: getday(), list: list });
// });
app.listen(3000, function () {
  console.log("server is running on port 3000...");
});
