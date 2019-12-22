import express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send([
    {
      name: 'Mittens',
      breed: 'Calico'
    },
    {
      name: 'Kitten',
      breed: 'Maine Coon'
    }
  ])
})

export default router
