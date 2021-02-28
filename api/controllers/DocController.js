module.exports = {
  test: function (req, res) {
    return res.json("Check");
  },
  addDoctor: async function (req, res) {
   let doctor= await Doctor.create(req.body).fetch();
   return res.json(doctor);
  },
  getDoctor: async function(req,res){
    let get_doctor = await Doctor.find(req.body);
    return res.json(get_doctor);

  },

  

  verifyToken: function (req, res) {
    res.json("token verified");
  },

  default: function (req, res) {
    res.json("Welcome to CatchTheReview Api Panel");
  },
};
