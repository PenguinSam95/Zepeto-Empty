using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using System.Collections.Generic;

public class MissingFinder : EditorWindow
{

    private Editor _editor;

    [MenuItem("Tools/Missing Finder")]
    private static void Open()
    {
        MissingFinder win = GetWindow<MissingFinder>();
        win.titleContent = new GUIContent("MissingFinder Tool");
        win.Show();
    }
    
    private bool _bEditOn = true;
    private void OnEnable()
    {
        _bEditOn = true;
    }
    private void OnDisable()
    {
        _bEditOn = false;
    }

    string getObjectHierarchy(GameObject go)
    {
        string path = go.name;
        Transform tr = go.transform;

        while (tr.parent != null)
        {
            path = tr.parent.name + " / " + path;
            tr = tr.parent;
        }

        return path;
    }

    void FindStart()
    {
        GameObject[] all = FindObjectsOfType<GameObject>();
        int count = 0;

        foreach (GameObject go in all)
        {
            Component[] components = go.GetComponents<Component>();

            foreach (Component c in components)
            {
                if (c == null)
                {
                    string fullPath = getObjectHierarchy(go);
                    Debug.LogError(fullPath + " has missing script!");
                    count++;
                }
            }

        }
        Debug.Log("Find "+count+" Missing MonoBehaviour Script~!");
    }

    void FindZepetoScript()
    {
        GameObject[] all = FindObjectsOfType<GameObject>();
        int count = 0;
        string z1 = "Zepeto";
        string z2 = "zepeto";
        string z3 = "ZEPETO";
        string eventSystem = "EventSystem";

        foreach (GameObject go in all)
        {
            Component[] components = go.GetComponents<Component>();
            if(go.name.Contains(eventSystem)) continue;

            foreach (Component c in components)
            {
                
                string fullPath = getObjectHierarchy(go);
                string cTostring = c+"";
                string[] spliter = cTostring.Split('(');
                string script = spliter[1];
                bool isZepeto = script.Contains(z1) || script.Contains(z2) || script.Contains(z3);
                if (isZepeto)
                {
                    Debug.Log("[FINDED] "+fullPath+" >>> "+c+" was zepeto script!");
                    count++;
                }
            }

        }
        Debug.Log("Find "+count+" ZepetoScriptMonoBehaviours~!");
    }

    private void OnGUI()
    {
        GUILayout.Space(20);
        ///////////////////////////////////////////////////



        if (GUILayout.Button("Find Missing Component"))
        {
            FindStart();
        }
        GUILayout.Space(20);
        ///////////////////////////////////////////////////



        if (GUILayout.Button("Find All Zepeto Scripts"))
        {
            FindZepetoScript();
        }
        GUILayout.Space(20);
        ///////////////////////////////////////////////////
    }
}