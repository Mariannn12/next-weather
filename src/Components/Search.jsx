import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import {debounce} from '@mui/material/utils';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import LocationOnIcon from '@mui/icons-material/LocationOn'
import _fetch from 'isomorphic-fetch';


const autocompleteService = {current : null};

export default function SearchAnyLocation(){

    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    
    const fetch= React.useMemo(()=>debounce((request, callback)=>{autocompleteService.current.getPlacePredictions(request,callback);},400),[],);

    React.useEffect(()=>{

        let active = true;
        
        if(!autocompleteService.current && window.google){
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
        }
    
        if(!autocompleteService.current){
          return undefined;
    
        }
    
        if(inputValue === ''){
          setOptions(value ? [value] : []);
          return undefined;
        }
    
        fetch({input: inputValue}, (results) => {
    
          if(active){
    
            let newOptions = [];
            
            if(value){
              newOptions = [value];
            }
    
            if(results){
              newOptions = [...newOptions, ...results];
            }
    
            setOptions(newOptions);
          }
        });
        
        return () => {
          active = false;
        };
    },[value, inputValue, fetch])
    
    return(

        <>
            <div  style={{display: 'flex',justifyContent: 'center' ,padding : 30}}>
        
                <Autocomplete
                id="google-map-demo"
                sx={{width: 300}}
                getOptionLabel= {(option)=> typeof option === 'string' ? option : option.description}
                filterOptions={(x) => x}
                options = {options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value = {value}
                noOptionsText = "No locations"
                onChange={(event,newValue) => {

                    setOptions(newValue ? [newValue, ...options]: options);
                    setValue(newValue);
                    window.location.href = `/search/${newValue.place_id}`
                }}
  
                onInputChange={(event,newInputValue)=>{
                setInputValue(newInputValue);
                }}
  
                renderInput= {(params)=> (
                    <TextField {...params} label="Add a location" fullWidth/>
                )}
  
                renderOption={(props, option)=>{
                    const matches = option.structured_formatting.main_text_matched_substrings || [];
  
                    const parts = parse(option.structured_formatting.main_text,matches.map((match) => [match.offset, match.offset + match.length]),
                );
  
                return(
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item sx={{display : 'flex', width : 44}}>
                                <LocationOnIcon sx={{color: 'text.secondary'}}/>
  
                            </Grid>
  
                            <Grid item sx={{width: 'calc(100% - 44px)', wordWrap: 'break-word'}} to="/bt">
                                {parts.map((part, index)=>(
                                    <Box key={index} component= "span" sx={{fontWeight : part.highlight ? 'bold' : 'regular'}}>{part.text}</Box>
                                ))}
  
                                <Typography variant ="body2" color="text.secondary">{option.structured_formatting.secondary_text}</Typography>

                            </Grid>
  
                        </Grid>
                    </li>
                )}}/>
            </div>
        
    </>
  )
}