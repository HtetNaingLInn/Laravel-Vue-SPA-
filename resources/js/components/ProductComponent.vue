<template>
    <div class="container my-4">
        <div class="row mb-3">
            <div class="col-md-4"></div>
            <div class="col-md-8">
                <div class="row">
                    <div class="col-md-6">
                        <button class="btn btn-primary" v-on:click="create">
                            <i class="fas fa-plus-circle"></i> Create
                        </button>
                    </div>
                    <div class="col-md-6">
                        <form>
                            <div class="input-group">
                                <input
                                    type="text"
                                    placeholder="search"
                                    class="form-control"
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-primary">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h4 class="text-info">
                            {{ editMode ? "edit" : "create" }}
                        </h4>
                    </div>
                    <div class="card-body">
                        <form
                            v-on:submit.prevent="
                                editMode ? productUpdate() : productCreate()
                            "
                        >
                            <div class="form-group">
                                <label for="name">Name :</label>
                                <input
                                    v-model="product.name"
                                    type="text"
                                    class="form-control"
                                />
                            </div>
                            <div class="form-group">
                                <label for="price">Price :</label>
                                <input
                                    v-model="product.price"
                                    type="number"
                                    class="form-control"
                                />
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>&nbsp; Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products.data" :key="product.id">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.price }}</td>
                            <td>
                                <button
                                    class="btn btn-success btn-sm"
                                    v-on:click="productEdit(product)"
                                >
                                    <i class="fas fa-edit"></i>&nbsp;Edit
                                </button>
                                <button
                                    class="btn btn-danger btn-sm"
                                    v-on:click="productDelete(product.id)"
                                >
                                    <i class="fas fa-trash-alt"></i>&nbsp;Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <pagination
                    :data="products"
                    @pagination-change-page="productList"
                    class="justify-content-center"
                >
                </pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductComponent.vue",
    data() {
        return {
            editMode: false,
            products: {},
            product: {
                id: "",
                name: "",
                price: ""
            }
        };
    },
    methods: {
        productList(page = 1) {
            this.$Progress.start();
            axios.get("/api/product?page=" + page).then(res => {
                this.products = res.data;
            });
            this.$Progress.finish();
        },

        productCreate() {
            this.$Progress.start();
            axios.post("/api/product", this.product).then(res => {
                this.productList();
                this.product = {
                    name: "",
                    price: ""
                };
            });
            this.$Progress.finish();
        },

        create() {
            this.$Progress.start();
            this.editMode = false;
            this.product.id = "";
            this.product.name = "";
            this.product.price = "";
            this.$Progress.finish();
        },

        productEdit(product) {
            this.$Progress.start();
            this.editMode = true;
            this.product.id = product.id;
            this.product.name = product.name;
            this.product.price = product.price;
            this.$Progress.finish();
        },

        productUpdate() {
            this.$Progress.start();
            axios
                .put(`/api/product/${this.product.id}`, this.product)
                .then(res => {
                    this.productList();
                    this.products.id = "";
                    this.product.name = "";
                    this.product.price = "";
                });
            this.$Progress.finish();
        },

        productDelete(id) {
            this.$Progress.start();
            if (!confirm("Are you sure to Delete")) {
                return;
            }
            axios.delete(`/api/product/${id}`).then(res => {
                this.productList();
            });
            this.$Progress.finish();
        }
    },
    created() {
        this.productList();
    }
};
</script>