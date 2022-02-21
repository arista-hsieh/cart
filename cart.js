const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'arista';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem:'',
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
              },
        };
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
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
        },
        getCart(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
            .then(res =>{
                this.cartData = res.data.data;
            });
        },
        updateCartItem(item){
            const data = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{ data })
            .then(res =>{
                
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        removeCartItem(id){
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
            .then(res =>{
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        addToCart(id,qty = 1){
            const data = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`,{ data })
            .then(res =>{
                
                this.getCart();
                this.$refs.productModal.closeModal();
                this.isLoadingItem = '';
            });
        },
        deleteAllCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url).then((response) => {
              alert(response.data.message);
              this.getCart();
            }).catch((err) => {
              alert(err.data.message);
            });
        },
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
})
.component('product-modal',{
    props:['id'],
    template:'#userProductModal',
    data(){
        return{
            modal:{},
            product:{},
            qty:1,
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
        closeModal(){
            this.modal.hide();
        },
        getProduct(){
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
            .then(res =>{
                this.product = res.data.product;
            });
        },
        addToCart(){
            this.$emit('add-cart',this.product.id,this.qty);
        },
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
})
.mount('#app');