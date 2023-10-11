import sys
from transformers import pipeline
import json

pipelines_text = {
    'Spam': {'BERT': pipeline("text-classification", model="mariagrandury/distilbert-base-uncased-finetuned-sms-spam-detection"),
             'RoBERTa': pipeline("text-classification", model="mariagrandury/roberta-base-finetuned-sms-spam-detection")
            },
    'Sentiment': {
        'BERT': pipeline("text-classification", model="lxyuan/distilbert-base-multilingual-cased-sentiments-student"),
        'RoBERTa': pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
    },
    'Emotion': {'BERT': pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion"),
             'RoBERTa': pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")
            }
}

if __name__ == '__main__':


    model = sys.argv[1]
    annotation = sys.argv[2]
    points = list(sys.argv[3:])

    pipe = pipelines_text[annotation][model]
    predictions = pipe(points)

    res = []

    for pred in predictions:
        if annotation == 'Spam':
            label = 'Not Spam' if pred['label'] == 'LABEL_0' else 'Spam'
        else:
            label = pred['label']

        score = '{:.2f}'.format(pred['score'])

        res.append({'label': label, 'score': score})


    print(json.dumps(res))
