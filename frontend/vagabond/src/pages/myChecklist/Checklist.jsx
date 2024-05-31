import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";
import { useAuth } from "../../context/authContext";
import { useLanguageContext } from "../../context/languageContext";

export default function Checklist() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const { t } = useLanguageContext();

  const texts = (data) => t(`checklist.${data}`);

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, { text: newItem, checked: false}]);
      setNewItem('');
    }
  };

  const handleToggleItem = (index) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems)
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_,i) => i !== index);
    setItems(updatedItems)
  }

  return (
    <Container maxWidth="md">
      <Header />
      <Box mt={4} mb={2}>
        <Typography variant='h7' sx={{ fontFamily: "Inter", fontWeight: 400}}>
          {texts("description")}
        </Typography>
      </Box>
      <List sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '0' }}>
        <ListItem>
          <Typography variant="subtitle1" sx={{ fontFamily: "Inter", fontWeight: 600 }}>
            {texts("checklistTitle")}
          </Typography>
        </ListItem>
        {items.map((item, index) => (
          <ListItem key={index} >
            <Checkbox
              checked={item.checked}
              onChange={() => handleToggleItem(index)}
            />
            <ListItemText primary={item.text} sx={{ fontFamily: "Inter", fontWeight: 500}} />
            <IconButton edge="end" onClick={() => handleDeleteItem(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Box display="flex" my={2}>
        <TextField 
          label={texts("newItem")}
          variant="outlined"
          fullWidth
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          sx={{ 
            mr:2,
            '& span': {
              fontFamily: 'Inter',
              fontWeight: 400,
            },
        }}/>
        <Button 
          variant="contained" 
          onClick={handleAddItem} 
          sx={{ 
            backgroundColor: '#2D6EFF',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
            '& span': {
              fontFamily: 'Inter',
              fontWeight: 500,
            },
          }}>
          {texts("button")}    
        </Button>
      </Box>
    </Container>
  )
}