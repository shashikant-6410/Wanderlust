class ExpressError extends Error {
    constructor(message = "Something went wrong", status = 500){
        super(message);
        // this.message=message;
        this.status=status;
         
    }
}

module.exports= ExpressError;