'use client'

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from './firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc } from 'firebase/firestore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #ddd',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    setLoading(true);
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item, quantity) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await setDoc(docRef, { quantity: parseInt(quantity) });
      await updateInventory();
    } catch (error) {
      setError(error.message);
    }
  };

  const updateItem = async (item, quantity) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await setDoc(docRef, { quantity: parseInt(quantity) });
      await updateInventory();
    } catch (error) {
      setError(error.message);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      await deleteDoc(docRef);
      await updateInventory();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setItemName('');
    setItemQuantity('');
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (editMode) {
      updateItem(currentItem, itemQuantity);
    } else {
      addItem(itemName, itemQuantity);
    }
    setItemName('');
    setItemQuantity('');
    handleClose();
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentItem(item.name);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setOpen(true);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{
        backgroundImage: `url('/pan.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Modal for adding or editing items */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: '#8B4513', color: '#FFFFFF', '&:hover': { backgroundColor: '#A0522D' } }}
            onClick={handleSubmit}
          >
            {editMode ? 'Update Item' : 'Add Item'}
          </Button>
        </Box>
      </Modal>
    
      {/* Button to open the modal */}
      <Button
        variant="contained"
        sx={{ backgroundColor: '#8B4513', color: '#FFFFFF', '&:hover': { backgroundColor: '#A0522D' } }}
        onClick={handleOpen}
      >
        Add New Item
      </Button>
    
      {/* Container for search bar with simulated margin color */}
      <Box
      >
        {/* Search bar */}
        <TextField
          label="Search Items"
          variant="outlined"
          width="100px"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% white background
            border: 'none', // Remove default border
          }}
        />
      </Box>
    
      {/* Loading, error, or inventory display */}
      {loading ? (
        <Typography sx={{ fontSize: '14px' }}>Loading...</Typography>
      ) : error ? (
        <Typography color="error" sx={{ fontSize: '14px' }}>{error}</Typography>
      ) : (
        <Box border={'1px solid #ddd'}>
          <Box
            width="800px"
            height="100px"
            bgcolor={'#D2691E'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h4'} color={'#333333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#FFFFFF'}
                paddingX={5}
              >
                <Typography variant={'h5'} color={'#333333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h5'} color={'#333333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#8B4513', color: '#FFFFFF', '&:hover': { backgroundColor: '#A0522D' } }}
                  onClick={() => handleEdit({ name, quantity })}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#8B4513', color: '#FFFFFF', '&:hover': { backgroundColor: '#A0522D' } }}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};  