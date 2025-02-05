const formatDate = (dob) => {
    if (!dob) return ""; // Handle empty or null values

    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

export default formatDate;