from django.http import HttpResponse, Http404
from .models import Question

# don't lead the loader as we are using the short version to load template
# from django.template import loader

from django.shortcuts import render, get_object_or_404



# DOESN'T LOAD TEMPLATE
# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     print([q.question_text for q in latest_question_list])
#     output = ', '.join([q.question_text for q in latest_question_list])
#     return HttpResponse(output)

## LONG VERSION WHICH LOADS TEMPLATE
# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     template = loader.get_template('polls/index.html')
#     context = {
#         'latest_question_list': latest_question_list,
#     }
#     return HttpResponse(template.render(context, request))

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)

# Leave the rest of the views (detail, results, vote) unchanged


# # LONG VERSION
# def detail(request, question_id):
#     # return HttpResponse("You're looking at question %s" %question_id)
#     try: 
#         question = Question.objects.get(pk=question_id)
#     except Question.DoesNotExist:
#         raise Http404("Question does not exist")
#     return render(request, 'polls/detail.html',{'question':question})

# USING the get_object_or_404
def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})


def results (request, question_id):
    response= "You're lokking at the results question %s"
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You're voting on question %s." %question_id)

