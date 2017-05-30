# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest

from scipy.optimize import curve_fit
from scipy.stats import linregress
from scipy.special import erf
import json, scipy, numpy

from myapps.pointing.models import *

def index(request):
    return render(request, 'pointing/index.html')

def spatial(request):
    return render(request, 'pointing/spatial.html')

def temporal(request):
    return render(request, 'pointing/temporal.html')

def combined(request):
    return render(request, 'pointing/combined.html')

# API

def rest_load(request):
    try:
        _mode = request.GET.get("mode", None)
        _setting = Setting.objects.get(mode=_mode, activate=True)

        output = {
            'settings': _setting.env
        }

        return JsonResponse(output)
    except:
        return HttpResponseBadRequest("ERROR: rest_load failed. (Modes should be in capital letters.)")

def rest_save(request):
    try:
        _mode = request.POST.get("mode", None)
        _user = json.loads(request.POST.get("user", None))
        _settings = json.loads(request.POST.get("settings", None))
        _logs = json.loads(request.POST.get("logs", None))
        _results = json.loads(request.POST.get("results", None))

        _setting = Setting.objects.get(mode=_mode, activate=True)

        _data = {
            "user": _user,
            "settings": _settings,
            "logs": _logs,
            "results": _results
        }

        result = Result(
            setting = _setting,
            data = _data
        )

        result.save()

        return HttpResponse()

    except:
        return HttpResponseBadRequest("ERROR: rest_save failed.")

def rest_result_spatial(request):
    try:
        settings = json.loads(request.POST.get("settings", None))
        logs = json.loads(request.POST.get("logs", None))

        xdata = []
        ydata = []

        for log in logs:
            T = log["start"]
            D = numpy.float_(log["env"]["distance"])
            W = numpy.float_(log["env"]["width"])
            trial = numpy.float_(log["env"]["trial"])

            sT = 0

            for i, stamp in enumerate(log["timestamps"]):
                if i == 0:
                    dT = stamp[0] - T
                else:
                    dT = stamp[0] - log["timestamps"][i - 1][0]

                sT += dT

            x = numpy.round(numpy.log2(2 * D / W), decimals=2)
            y = numpy.round(numpy.float_(sT) / trial / 1000, decimals=2)

            xdata.append(x)
            ydata.append(y)

        xdata = numpy.array(xdata) # ID
        ydata = numpy.array(ydata) # MT

        a, b, r, p, err = linregress(xdata, ydata) # y = a * x + b

        _xdata = []
        _ydata = []

        for _x in numpy.arange(0, xdata.max() + 1, 0.1):
            _xdata.append(_x)
            _ydata.append(_x * a + b)

        output = {
            'a': numpy.round(a, decimals=4),
            'b': numpy.round(b, decimals=4),
            'rsq': numpy.round(r ** 2, decimals=4),
            'x': list(xdata),
            'y': list(ydata),
            '_x': list(_xdata),
            '_y': list(_ydata)
        }

        return JsonResponse(output)
    except:
        return HttpResponseBadRequest("ERROR: rest_result_spatial failed.")

def rest_result_temporal(request):
    try:
        settings = json.loads(request.POST.get("settings", None))
        logs = json.loads(request.POST.get("logs", None))

        xdata = []
        ydata = []

        for log in logs:
            T = log["start"]
            D = numpy.float_(log["env"]["interval"])
            W = numpy.float_(log["env"]["duration"])
            trial = numpy.float_(log["env"]["trial"])

            C = trial

            for stamp in log["timestamps"]:
                if stamp[1] == "success":
                    C -= 1

            x = numpy.round(numpy.log2(D / W), decimals=2)
            y = numpy.round(numpy.float_(C) / trial, decimals=2)

            xdata.append(x)
            ydata.append(y)

        xdata = numpy.array(xdata) # ID
        ydata = numpy.array(ydata) # Err Rate

        def func(x, s, m):
            return (1 - (erf((1 - m) / s / numpy.exp2(x + 0.5)) + erf(m / s / numpy.exp2(x + 0.5))) / 2)

        opt, cov = curve_fit(func, xdata, ydata)

        # CALCULATE R-SQ
        res = numpy.sum((ydata - func(xdata, opt[0], opt[1])) ** 2)
        tot = numpy.sum((ydata - numpy.mean(ydata)) ** 2)
        rsq = 1 - (res / tot)

        _xdata = []
        _ydata = []

        for _x in numpy.arange(0, xdata.max() + 1, 0.1):
            _xdata.append(_x)
            _ydata.append(func(_x, opt[0], opt[1]))

        output = {
            's': numpy.round(opt[0], decimals=4),
            'm': numpy.round(opt[1], decimals=4),
            'rsq': numpy.round(rsq, decimals=4),
            'x': list(xdata),
            'y': list(ydata),
            '_x': list(_xdata),
            '_y': list(_ydata)
        }

        return JsonResponse(output)
    except:
        return HttpResponseBadRequest("ERROR: rest_result_temporal failed.")

def rest_result_combined(request):
    pass
