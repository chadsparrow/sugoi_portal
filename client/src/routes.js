import Home from './routes/Home.vue'
import EditDetails from './routes/EditDetails.vue'
import EditLine from './routes/EditLine.vue'
import EditItem from './routes/EditItem.vue'

export default [
    {
        path: '/:orderNum', component: Home, children: [
            { path: '/editdetails', component: EditDetails },
        ]
    },
    {
        path: '/editline/:lineIndex', component: EditLine, children: [
            { path: '/:itemIndex', component: EditItem }
        ]
    }
]