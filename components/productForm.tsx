import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Product } from '../types/product';
import { createProduct, updateProduct } from '../services/productApi';
import { ApiResponse } from '../types/apiResponse';
import {
    Box,
    Button,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
    IconButton,
    ImageList,
    ImageListItem,
    Paper,
    Toolbar,
    AppBar,
    Container,
    CssBaseline,
    styled,
    LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AxiosResponse } from 'axios';
import api from '../api';

interface RouteParams {
    id: string | undefined;
    [key: string]: string | undefined;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

const ProductForm: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number | ''>('');
    const [stock, setStock] = useState<number | ''>('');
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setIsUpdate(true);
            fetchProductDetails(id);
        } else {
            setIsUpdate(false);
            resetForm();
        }
    }, [id]);

    const fetchProductDetails = async (productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Product>(`/api/products/products/${productId}`);
            const data = response.data;
            setName(data.name);
            setPrice(data.price);
            setStock(data.stock);
            setPreviewImages(data.images.map((img: string) => `http://localhost:5000/uploads/${img.replace(/\\/g, '/')}`));
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setStock('');
        setImages([]);
        setPreviewImages([]);
        setError(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'price') {
            setPrice(value === '' ? '' : parseFloat(value));
        } else if (name === 'stock') {
            setStock(value === '' ? '' : parseInt(value, 10));
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages: File[] = Array.from(files);
            setImages(newImages);
            const previews = newImages.map((file) => URL.createObjectURL(file));
            setPreviewImages((prev) => [...prev, ...previews]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!name || price === '' || stock === '') {
            setError('Name, price, and stock are required.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', String(price));
        formData.append('stock', String(stock));

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            let apiResponse: AxiosResponse<ApiResponse<Product>> | undefined;
            if (isUpdate && id) {
                apiResponse = await updateProduct(id, formData);
            } else {
                apiResponse = await createProduct(formData);
            }

            if (apiResponse?.data?.message) {
                alert(apiResponse.data.message);
            } else {
                alert(`Product ${isUpdate ? 'updated' : 'created'} successfully!`);
            }
            navigate('/products');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || `Failed to ${isUpdate ? 'update' : 'create'} product`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LinearProgress sx={{ mt: 2 }} />;
    }

    return (
        <CssBaseline>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" component={Link} to="/products">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {isUpdate ? 'Update Product' : 'Create New Product'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ mt: 3 }}>
                <StyledPaper elevation={3}>
                    <Typography variant="h5" gutterBottom>
                        {isUpdate ? 'Edit Product Details' : 'Enter New Product Details'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Name"
                                id="name"
                                name="name"
                                value={name}
                                onChange={handleInputChange}
                                required
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Price"
                                id="price"
                                name="price"
                                type="number"
                                value={price}
                                onChange={handleInputChange}
                                required
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Stock"
                                id="stock"
                                name="stock"
                                type="number"
                                value={stock}
                                onChange={handleInputChange}
                                required
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Upload Images
                                <Input
                                    id="images"
                                    name="images"
                                    type="file"
                                    onChange={handleImageChange}
                                    inputProps={{ multiple: true, accept: "image/*" }}
                                    sx={{ display: 'none' }}
                                />
                            </Button>
                            <FormHelperText>Select one or more images</FormHelperText>
                        </FormControl>

                        {previewImages && previewImages.length > 0 && (
                            <ImagePreviewContainer>
                                <Typography variant="subtitle1">Image Previews:</Typography>
                                <ImageList rowHeight={100} cols={3}>
                                    {previewImages.map((preview, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={preview}
                                                alt={`preview-${index}`}
                                                loading="lazy"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </ImagePreviewContainer>
                        )}

                        <StyledButton
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            size="large"
                        >
                            {isUpdate ? 'Update Product' : 'Create Product'}
                        </StyledButton>
                    </form>
                </StyledPaper>
            </Container>
        </CssBaseline>
    );
};

export default ProductForm;