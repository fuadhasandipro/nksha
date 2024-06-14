const subscriptionTimeLeft = (subscriptionDateStr) => {
    const subscriptionDate = new Date(subscriptionDateStr);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = currentDate - subscriptionDate;

    // Convert the difference to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return differenceInDays
}

export default subscriptionTimeLeft