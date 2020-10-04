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
                        <form v-on:submit.prevent="productSearch()">
                            <div class="input-group">
                                <input
                                    v-model="search"
                                    type="text"
                                    placeholder="search"
                                    class="form-control"
                                />
                                <div class="input-group-append">
                                    <button
                                        class="btn btn-primary"
                                        type="submit"
                                    >
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
                        <alert-error
                            :form="product"
                            v-bind:message="error"
                        ></alert-error>
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
                                    :class="{
                                        'is-invalid': product.errors.has('name')
                                    }"
                                />
                                <has-error
                                    :form="product"
                                    field="name"
                                ></has-error>
                            </div>
                            <div class="form-group">
                                <label for="price">Price :</label>
                                <input
                                    v-model="product.price"
                                    type="number"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': product.errors.has(
                                            'price'
                                        )
                                    }"
                                />
                                <has-error
                                    :form="product"
                                    field="price"
                                ></has-error>
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
                ></pagination>
            </div>
        </div>
        <loading
            :active.sync="isLoading"
            :is-full-page="true"
            :color="color"
            :loader="loader"
        ></loading>
    </div>
</template>

<script>
import Loading from "vue-loading-overlay";

import "vue-loading-overlay/dist/vue-loading.css";
export default {
    name: "ProductComponent.vue",
    components: {
        Loading
    },
    data() {
        return {
            editMode: false,
            isLoading: false,
            color: "#3490dc",
            loader: "bars",
            search: "",
            products: {},
            error: "",
            product: new Form({
                id: "",
                name: "",
                price: ""
            })
        };
    },
    methods: {
        productSearch() {
            this.$Progress.start();
            axios.get("/api/product?search=" + this.search).then(res => {
                this.products = res.data;
                this.$Progress.finish();
            });
        },

        productList(page = 1) {
            this.isLoading = true;
            this.$Progress.start();
            axios.get("/api/product?page=" + page).then(res => {
                this.products = res.data;
                this.isLoading = false;
                this.$Progress.finish();
            });
        },

        productCreate() {
            this.$Progress.start();
            this.product
                .post("/api/product")
                .then(res => {
                    this.productList();
                    this.product.reset();
                    Toast.fire({
                        icon: "success",
                        title: "Created successfully"
                    });
                })
                .catch(err => {
                    this.error = err.response.data.message;
                });
            this.$Progress.finish();
        },

        create() {
            this.$Progress.start();
            this.product.clear();
            this.editMode = false;
            this.product.reset();
            this.$Progress.finish();
        },

        productEdit(product) {
            this.$Progress.start();
            this.product.clear();
            this.editMode = true;
            this.product.id = product.id;
            this.product.name = product.name;
            this.product.price = product.price;
            this.$Progress.finish();
        },

        productUpdate() {
            this.$Progress.start();
            this.product
                .put(`/api/product/${this.product.id}`)
                .then(res => {
                    this.productList();
                    this.product.reset();
                    this.create();
                    Toast.fire({
                        icon: "success",
                        title: "Edited successfully"
                    });
                })
                .catch(err => {
                    this.error = err.response.data.message;
                });
            this.$Progress.finish();
        },

        productDelete(id) {
            this.$Progress.start();
            Swal.fire({
                title: "Are you sure?",
                text: "",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete it!"
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                    axios.delete(`/api/product/${id}`).then(res => {
                        this.productList();
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Deleted successfully"
                    });
                }
            });

            this.$Progress.finish();
        }
    },
    created() {
        this.productList();
    }
};
</script>
