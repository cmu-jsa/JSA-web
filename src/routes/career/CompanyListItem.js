/**
 * Company List Item Component
 *
 * @module src/routes/career
 */

import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    number, object
} from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { 
    PlaidDescription,
    JmcDescription,
    MujinDescription,
    MenuDescription,
    PlaystationDescription
} from './descriptions';

const descriptions = {
    0: PlaidDescription,
    1: JmcDescription,
    2: MujinDescription,
    3: MenuDescription,
    4: PlaystationDescription
};

/* eslint-disable no-unused-vars */
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    }) }));
/* eslint-enable no-unused-vars */

const CompanyListItem = (props) => {
    const { company, index } = props;
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <ListItem>
            <Card sx={{ minWidth: 768 }}> 
                <CardMedia
                    component='img'
                    height='250'
                    image={company.imagePath}
                    alt={company.name}
                />
                <CardContent>
                    <Typography 
                        gutterBottom variant="h5"
                        component="div">
                        {company.name}
                    </Typography>
                    <Typography variant="body2">
                        {company.industry}
                    </Typography>
                </CardContent>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1}>
                            {company.intern === '1' && 
                                <Chip
                                    label="Internship"
                                    color="primary"
                                    size ='small'
                                />
                            }
                            {company.fulltime === '1' &&
                                <Chip
                                    label="Fulltime"
                                    color="primary"
                                    size ='small'
                                />
                            }
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            {company.japan === '1' &&
                                <Chip
                                    label="Japan"
                                    color="secondary"
                                    size ='small'
                                />
                            }
                            {company.us === '1' &&
                                <Chip
                                    label="US"
                                    color="secondary"
                                    size ='small'
                                />
                            }
                            {company.china === '1' &&
                                <Chip
                                    label="China"
                                    color="secondary"
                                    size ='small'
                                />
                            }
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            {company.japanese === '1' &&
                                <Chip
                                    label="Japanese required"
                                    color="success"
                                    size ='small'
                                />
                            }
                            {company.english === '1' &&
                                <Chip
                                    label="English required"
                                    color="success"
                                    size ='small'
                                />
                            }
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        href={company.url}
                        target="_blank">
                        Website
                    </Button>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <ReactMarkdown>
                            {descriptions[index]}
                        </ReactMarkdown>
                    </CardContent>
                </Collapse>
            </Card>
        </ListItem>
    );
};

CompanyListItem.propTypes = {
    company: object,
    index: number
};

export default CompanyListItem;