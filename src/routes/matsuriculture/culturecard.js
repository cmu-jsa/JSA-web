import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';


const useStyles = makeStyles({
    root: {
        maxWidth: 750
    }
});
/**
 * Hello
 * @param {any} props sfd 
 * @param {string} props.title  title
 * @returns {ReactComponent} fdsafads
 */
const style = {
    width: "auto",
    height: "auto",
    maxHeight: "500px",
    display: "block",
    marginLeft :"auto",
    marginRight: "auto",
    resize : {
        width: "auto",
        height: "400px",
    }
    
}
const ImgMediaCard = (props) => {
    const classes = useStyles();
    var a;
    console.log(props);
    const parsed = Number.parseInt(props.contentType, 10);
    if (parsed === 0){
        a = true;
    } else {
        a = false;
    }
    
    
    /*height= "80%"
                        width = "100%"
                        objectFit= 'cover'*/
    return (
        <Card className={classes.root}>
            
                {a ? 
                    <CardMedia
                        component="img"
                        alt="a"
                        style={style}
                        src={ props.url }
                        title="Pain"
                    /> : 
                    <CardMedia
                        component="iframe"
                        alt="a"
                        height="400"
                        src={ props.url }
                        title="Pain"
                    /> 
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
                    </Typography>
                </CardContent>
            
            <CardActions>
                <Button size="small" color="primary">
                    <a href='/matsuri/schedule'>Schedule</a>
                </Button>
                <Button size="small" color="primary">
                {props.link ? <a href={props.link}>More Information</a> : null}
                </Button>
            </CardActions>
        </Card>
    );
};
ImgMediaCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    contentType: PropTypes.string,
    link: PropTypes.link
};
export default ImgMediaCard;