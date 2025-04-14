import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import {
    getProducts,
    deleteProduct,
    getProductsByName,
    getProductsByCreatedAt,
    getProductsByStock,
} from '../services/productApi';
import {
    Select,
    MenuItem,
    Box,
    Button,
    ImageList,
    ImageListItem,
    IconButton,
    InputLabel,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Toolbar,
    AppBar,
    Container,
    CssBaseline,
    styled,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('name');
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('name');
    const [filterValue, setFilterValue] = useState<string>('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (sort?: string, filter?: { name?: string; stock?: string }) => {
        setLoading(true);
        setError(null);
        console.log("Fetching products...");
        try {
            const response = await getProducts(sort, filter);
            console.log("Products fetched successfully:", response.data);
            setProducts(response.data || []);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
            console.log("Final error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await deleteProduct(id);
                if (response.data.message === 'Product deleted successfully') {
                    setProducts(products.filter(product => product._id !== id));
                } else {
                    alert(`Error deleting product: ${response.data.message || 'Unknown error'}`);
                }
            } catch (error: any) {
                alert(`Failed to delete product: ${error.message}`);
            }
        }
    };

    const handleSortChange = (event: any) => {
        setSortOption(event.target.value);
        fetchProducts(event.target.value, filterQuery ? { name: filterQuery } : undefined);
    };

    const handleFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterQuery(event.target.value);
    };

    const handleFilterTypeChange = (event: any) => {
        setFilterType(event.target.value);
        setFilterValue('');
        setProducts([]);
    };

    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const handleApplyFilter = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (filterType) {
                case 'name':
                    response = await getProductsByName(filterValue);
                    break;
                case 'createdAt':
                    const date = new Date(filterValue);
                    if (isNaN(date.getTime())) {
                        setError('Invalid date format');
                        setLoading(false);
                        return;
                    }
                    response = await getProductsByCreatedAt(date);
                    break;
                case 'stock':
                    const stock = parseInt(filterValue, 10);
                    if (isNaN(stock)) {
                        setError('Invalid stock value');
                        setLoading(false);
                        return;
                    }
                    response = await getProductsByStock(stock);
                    break;
                default:
                    response = await getProducts(sortOption, undefined);
                    break;
            }

            if (response) {
                setProducts(response.data || []);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to filter products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography variant="body1">Loading products...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <CssBaseline>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Product Inventory
                    </Typography>
                    <Button color="inherit" component={Link} to="/create" startIcon={<AddIcon />}>
                        Add Product
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 3 }}>
                <StyledPaper>
                    <Typography variant="h5" gutterBottom>
                        Product List
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SortIcon sx={{ mr: 1 }} />
                            <InputLabel htmlFor="sortOption">Sort By:</InputLabel>
                            <Select
                                id="sortOption"
                                value={sortOption}
                                onChange={handleSortChange}
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                                <MenuItem value="createdAt">Created At</MenuItem>
                                <MenuItem value="stock">Stock</MenuItem>
                            </Select>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FilterListIcon sx={{ mr: 1 }} />
                            <InputLabel htmlFor="filterType">Filter By:</InputLabel>
                            <Select
                                id="filterType"
                                value={filterType}
                                onChange={handleFilterTypeChange}
                                sx={{ minWidth: 180 }}
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="createdAt">Created At (after date)</MenuItem>
                                <MenuItem value="stock">Stock (minimum)</MenuItem>
                            </Select>
                            <TextField
                                label={`Enter filter value for ${filterType}`}
                                value={filterValue}
                                onChange={handleFilterValueChange}
                                size="small"
                                sx={{ ml: 1 }}
                            />
                            <Button variant="outlined" onClick={handleApplyFilter} sx={{ ml: 1 }}>
                                Apply
                            </Button>
                        </Box>
                    </Box>

                    <List>
                        {products.map((product) => (
                            <ListItem key={product._id} divider alignItems="center">
                                <Box sx={{ marginRight: 2, display: 'flex', alignItems: 'center' }}>
                                    {product.images && product.images.length > 0 && (
                                        <ImageList rowHeight={50} cols={Math.min(product.images.length, 3)} sx={{ maxWidth: 150 }}>
                                            {product.images.map((img, index) => (
                                                <ImageListItem key={index}>
                                                    <img
                                                        src={`http://localhost:5000/uploads/product_images/${img}`}
                                                        alt={`${product.name} - Image ${index + 1}`}
                                                        loading="lazy"
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                    />
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    )}
                                </Box>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1">
                                            {product.name} - <Typography component="span" color="primary">${product.price}</Typography>
                                        </Typography>
                                    }
                                    secondary={`Stock: ${product.stock}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        component={Link}
                                        to={`/update/${product._id}`}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => product._id && handleDelete(product._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    {products.length === 0 && !loading && (
                        <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 2 }}>
                            No products found.
                        </Typography>
                    )}
                </StyledPaper>
            </Container>
        </CssBaseline>
    );
};

export default ProductList;


