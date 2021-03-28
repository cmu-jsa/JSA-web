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
const ImgMediaCard = (props) => {
    const classes = useStyles();
    var a;
    console.log(props);
    const parsed = Number.parseInt(props.test, 10);
    if (parsed === 0){
        a = true;
        console.log('here');
    } else {
        a = false;
        console.log('not here');
    }
    return (
        <Card className={classes.root}>
            <CardActionArea>
                {a ? 
                    <CardMedia
                        component="img"
                        alt="a"
                        height="400"
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
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    <a href='../matsuri/'>Schedule</a>
                </Button>

            </CardActions>
        </Card>
    );
};
ImgMediaCard.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    test: PropTypes.string
};
export default ImgMediaCard;