import React, { useState, useEffect } from 'react';
import Title from './Title';
import { useParams } from 'react-router-dom';
import { CircularProgress, TextField, Grid, makeStyles, Theme, createStyles, Typography, Button } from '@material-ui/core';
import Recipe from '../Model/Recipe';
import api from '../Service/Api';
import moment from 'moment';
import Paper from './Paper';
import RemoveRecipeButton from './RemoveRecipeButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        marginLeft: 0
      },
    }
  }),
);

const RecipeDetails: React.FC = () => {
  const { id } = useParams();
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<Recipe|null>();
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = (key: string) => (e: any) => {
    setRecipe(new Recipe({ ...recipe, [key]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await api.updateRecipe(recipe as Recipe);

    setRecipe(result);
    setSaving(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      
      if (!id) {
        return;
      }

      const recipe = await api.getRecipeDetailsById(parseInt(id));

      setRecipe(recipe);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!recipe) {
    return <Typography>Can't load recipe :/</Typography>
  }

  const createdAt = 'Created ' + moment(recipe.createdAt || undefined).fromNow();
  
  let updatedAt = 'never updated';

  if (recipe.createdAt?.toString() !== recipe.updatedAt?.toString()) {
    updatedAt = 'updated ' + moment(recipe.updatedAt || undefined).fromNow();
  } 

  return (
    <React.Fragment>
      <Grid container direction="row" alignContent="space-between" alignItems="flex-start">
        <Grid item xs>
          <Title>Editing recipe {id}</Title>
        </Grid>
        <Grid item>
          <RemoveRecipeButton recipeId={recipe.id} />
        </Grid>
      </Grid>

      <Typography variant="body2">{createdAt}, {updatedAt}</Typography>

      <br />

      <Grid container>
        <Grid item xs={12} md={4}>
          <Paper>
            <Title size="small">Basics</Title>

            <form className={classes.root}>
              <TextField
                id="name"
                onChange={handleChange('name')}
                value={recipe.name}
                label="Name"
                fullWidth
              />

              <TextField
                id="author"
                value={recipe.author}
                label="Author"
                disabled
                fullWidth
              />

              <TextField
                id="style"
                value={recipe.style}
                onChange={handleChange('style')}
                label="Style"
                fullWidth
              />

              <TextField
                id="batchSize"
                type="number"
                value={recipe.batchSize}
                onChange={handleChange('batchSize')}
                label="Batch size (l)"
                fullWidth
              />
            </form>

            <Grid container direction="row" justify="flex-end">
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSave}
                disabled={saving}
              >
                Save
              </Button>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs></Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RecipeDetails;