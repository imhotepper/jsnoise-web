import Vue from 'vue'
import Router from 'vue-router'
import Podcasts from '@/pages/Podcasts'
import ProducerPodcasts from '@/pages/ProducerPodcasts'
import Producers from '@/pages/Producers'
import FeedTester from '@/pages/FeedTester'
import Login from '@/pages/Login'
import Podcast from '@/pages/Podcast'
import Error from '@/pages/Error'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'root',
      component: Podcasts
    },
    {
      path: '/shows/:id',
      component: Podcast,
      props: true
    },
    {
      path: '/producers/:producer_id',
      component: ProducerPodcasts,
      props: true,
      name: 'producerShows'
    },
    {
      path: '/admin/producers',
      component: Producers,
      name:'producers',
      beforeEnter(to, from, next) {
        var isAuth = localStorage.getItem("auth") || "";
        if ((isAuth.length > 0)) next();
        else next("/login");
      }
    },
    {
      path: '/admin/test',
      name: 'feedTester',
      component: FeedTester
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter(to, from, next) {
        localStorage.removeItem("auth");
        next("/");
      }
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    },
    {
      path: '*',
      component: Podcasts,
      beforeEnter(to, from, next) {
        console.log("*");
        next();
      }
    }
  ]
});

export default router;
