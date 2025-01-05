const fs = require('fs');
const path = require('path');

const getItem = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../assest/inventory_menu.json');


    const data = fs.readFileSync(filePath, 'utf-8');
    const inventory = JSON.parse(data);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }
    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item data'
    });
  }
};

module.exports = { getItem };
