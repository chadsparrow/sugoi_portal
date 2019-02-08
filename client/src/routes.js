import Home from './routes/Home.vue'
import EditDetails from './routes/EditDetails.vue'
import EditLine from './routes/EditLine.vue'
import EditItem from './routes/EditItem.vue'

export default [
    { path: '/:orderNum', component: Home },
    { path: '/:orderNum/editdetails', component: EditDetails },
    { path: '/editline/:index', component: EditLine },
    { path: '/edititem/:index', component: EditItem }
]