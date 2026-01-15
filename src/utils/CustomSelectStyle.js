
export const customStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '38px',
        borderRadius: '5px',
        borderColor: state.isFocused ? '#00904a' : '#ced4da',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 144, 74, 0.2)' : null,
        "&:hover": {
            borderColor: '#00904a'
        }
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#e6f4ea',
        borderRadius: '20px',
        border: '1px solid #ceead6',
        padding: '2px 5px',
        margin: '2px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#137333',
        fontWeight: '600',
        paddingLeft: '6px',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#137333',
        borderRadius: '50%',
        marginLeft: '5px',
        "&:hover": {
            backgroundColor: '#ceead6',
            color: '#d93025',
            cursor: 'pointer'
        }
    }),
    placeholder: (base) => ({
        ...base,
        color: '#6c757d',
        fontSize: '14px'
    })
};