import ServiceModel from "../models/service.model";

class ServiceService{
    async getServiceByQuery(query:string){
        try{
            const service = await ServiceModel.findOne({query});
            if(!service){
                return "Что-то пошло не так. Попробуйте еще раз."
            }
            return service
            
        }
        catch(e){
            console.log(e);
        }
        return;
    }
}

export default new ServiceService();