import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
let theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // A nice blue
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#ef6c00', // A warm orange
            light: '#ff9d3f',
            dark: '#b53d00',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#f4f6f8', // Lighter background
            paper: '#ffffff',
        },
        text: {
            primary: '#2c3e50', // Darker grey for better contrast
            secondary: '#7f8c8d', // Lighter grey
        }
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            fontSize: '2.8rem',
            fontWeight: 600,
            letterSpacing: '-0.01562em',
        },
        h2: {
            fontSize: '2.2rem',
            fontWeight: 600,
            letterSpacing: '-0.00833em',
        },
        h3: {
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0em',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.00735em',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            letterSpacing: '0em',
        },
        h6: {
            fontSize: '1.1rem',
            fontWeight: 500,
            letterSpacing: '0.0075em',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
            letterSpacing: '0.00938em',
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            letterSpacing: '0.00938em',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none', // Less shouty buttons
            fontWeight: 500,
        }
    },
    shape: {
        borderRadius: 8, // Slightly more rounded corners
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                }
            }
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true, // Flatter buttons by default
            },
            styleOverrides: {
                root: {
                    padding: '8px 22px', // Default padding for buttons
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#115293', // Darker primary on hover
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#aa4a00', // Darker secondary on hover
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.08)', // Softer shadow
                }
            }
        },
        MuiTextField: { // Ensure TextFields get styled
            defaultProps: {
                variant: 'outlined', // Default to outlined
            }
        },
        MuiSelect: { // Ensure Selects get styled
            defaultProps: {
                variant: 'outlined',
            }
        }
    },
});

theme = responsiveFontSizes(theme); // Make fonts responsive

export default theme;