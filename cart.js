const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'arista';

Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
        };
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
            .then(res =>{
                this.products = res.data.products;
            });
        },
        openProductModal(id){
            this.productId = id;
            this.$refs.productModal.openModal();
        }
    },
    mounted(){
        this.getProducts();
    }
})
.component('product-modal',{
    props:['id'],
    template:'#userProductModal',
    data(){
        return{
            modal:{},
            product:{},
        };
    },
    watch:{
        id(){
            this.getProduct();
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        getProduct(){
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
            .then(res =>{
                this.product = res.data.product;
            });
        },
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
})
.mount('#app');