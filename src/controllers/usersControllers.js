const mockUserProfile = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 30,
    address: "123 Main St, Anytown, USA"
  };
  
  // Controller function to get user profile
  const getProfile = (req, res) => {
    try {
      // In a real-world application, fetch the profile data from a database here
      res.status(200).json({
        success: true,
        data: mockUserProfile
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user profile."
      });
    }
  };
  
  module.exports = {
    getProfile
  };