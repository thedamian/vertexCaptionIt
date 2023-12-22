import 'dotenv/config';
import cors from "cors";

interface ProcessEnv {
    VERTEX_projectId : string;
    VERTEX_location : string;
    VERTEX_modelId : string;
    OPENAI_API_KEY : string;
}
const  {VERTEX_projectId,VERTEX_location,VERTEX_modelId,OPENAI_API_KEY} =  process.env; 


// Vertex AI
// import {PredictionServiceClient}  from '@google-cloud/aiplatform';
// const  {VERTEX_projectId,VERTEX_location,VERTEX_modelId}: ProcessEnv =  process.env; // defined in glocal.d.ts
// const clientOptions = { apiEndpoint: 'us-central1-aiplatform.googleapis.com' };

// OpenAI
//import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});
// const configuration = new Configuration({
//     apiKey: OPENAI_API_KEY,
//   });
//const openai : OpenAIApi = new OpenAIApi(configuration);




import express,{Request,Response,NextFunction} from "express";
let app = express();
// app.use(express.bodyParser({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(cors());
app.use(express.static("./public"));
let PORT = 5023;

  app.get("/", (req: Request, res: Response)  => { 
    res.render("index.ejs"); // Render the index.ejs file
  })

  app.post("/caption", async (req: Request, res: Response) => { 
        try {
        const filebase64 = req.body.file;

        // // vertex ai process image and return caption
        //   const predictionServiceClient = new PredictionServiceClient(clientOptions);
        //   const modelFullId = predictionServiceClient.modelPath(projectId, location, modelId);
        //   const params = {confidenceThreshold: 0.5};
        //   const payload = {
        //     image: {
        //       imageBytes: req.body.file,
        //     },
        //   };
        //   const request = {
        //     endpoint: 'us-central1-prediction-aiplatform.googleapis.com',
        //     name: modelFullId,
        //     payload: payload,
        //     params: params,
        //   };
        //   const [response] = await predictionServiceClient.predict(request);
        //   console.log(`Prediction results:`);
        //   console.log(response);
        
        const OpenAIresponse = await openai.chat.completions.create({
            model: "gpt-4-vision-preview", // you have to be a openai paying member for this.
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "What's in this image?" },
                  {
                    type: "image_url",
                    image_url: {
                      "url": filebase64,
                    },
                  },
                ],
              },
            ],
          });
          const response = OpenAIresponse.choices[0];
          console.log(response);


      res.status(200).json({message: "success", caption: response})

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "error", error: error})
        }

  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }); //  I need it in port 5024 for my server. you  should change it to what ever you want.